import {Group, Radio} from '@mantine/core';
import {Option} from '../../../parser/types';


type inputProps = {
    title: string,
    desc: string,
    radioData?: Option[],
    required: boolean,
    answer:object;
}

export default function RadioInput({ title='Your Question', desc='additional description', radioData=[], answer, required }: inputProps) {
    return (
        <>
            <Radio.Group
                name="radioInput"
                label={title}
                description={desc}
                withAsterisk={required}
                size={'md'}
                {...answer}
            >
                <Group mt="xs">
                    {
                        radioData.map((radio) => {
                            return (
                                <Radio value={radio.value} label={radio.label} />
                            );
                        })
                    }

                </Group>
            </Radio.Group>
        </>
    );
}
