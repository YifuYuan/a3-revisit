import { Response } from '../../../parser/types';
import {saveTrialAnswer, useAppDispatch} from '../../../store';
import ResponseSwitcher from './ResponseSwitcher';
import {NextButton} from '../../NextButton';
import {Button, Group} from '@mantine/core';
import {useCurrentStep} from '../../../routes';
import {useParams} from 'react-router-dom';
import {createTrialProvenance} from '../../../store/trialProvenance';
import {useNextTrialId, useTrialsConfig} from '../../../controllers/TrialController';
import {useForm} from '@mantine/form';
import {useEffect} from 'react';
import {useNextStep} from '../../../store/hooks/useNextStep';
import {useTrialStatus} from '../../../store/hooks/useTrialStatus';
import {generateInitFields, generateValidation} from './utils';

type Props = {
    responses: Response[];
};

export default function ResponseBlock({ responses }: Props) {

    const dispatch = useAppDispatch();
    const currentStep = useCurrentStep();
    const nextStep = useNextStep();
    const { trialId = null } = useParams<{ trialId: string }>();
    const nextTrailId = useNextTrialId(trialId);
    const trialStatus = useTrialStatus(trialId);
    
    if (!responses || !trialStatus || !trialId) return <></>;

    const answerField = useForm({
        initialValues: generateInitFields(responses),
        validate: generateValidation(responses),
    });

    useEffect(() => {
        responses.forEach((response) => {
            const ans = (trialStatus.answer && typeof trialStatus.answer === 'string') ? JSON.parse(trialStatus.answer) : {};
            answerField.setFieldValue(response.id, ans[response.id] || '');
        });
    }, [trialStatus.answer]);

    return (
        <>
            <form onSubmit={answerField.onSubmit(console.log)}>
            {
                responses.map((response, index) => {
                    return (
                        <ResponseSwitcher key={index} status={trialStatus} answer={answerField.getInputProps(response.id)} response={response} />
                    );
                })
            }

                <Group position="right" spacing="xs" mt="xl">
                {nextTrailId ? (
                    <NextButton
                        disabled={!answerField.isValid()}
                        to={`/${currentStep}/${nextTrailId}`}
                        process={() => {
                            if (trialStatus.complete) {
                                answerField.setFieldValue('input', '');
                            }

                            const answer = JSON.stringify(answerField.values);
                            console.log(answer,'answer');

                            dispatch(
                                saveTrialAnswer({
                                    trialName: currentStep,
                                    trialId,
                                    answer: answer,
                                })
                            );

                            answerField.setFieldValue('input', '');
                        }}
                    />
                ) : (
                    <NextButton
                        to={`/${nextStep}`}
                        process={() => {
                            // complete trials
                        }}
                    />
                )}
            </Group>
            </form>
        </>
    );
}
