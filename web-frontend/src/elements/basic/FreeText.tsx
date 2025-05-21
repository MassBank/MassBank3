import { CSSProperties } from 'react';
import Typography from 'antd/es/typography';
const { Paragraph, Text } = Typography;

type InputProps = {
  text: string;
  style?: CSSProperties;
};

function FreeText({ text, style }: InputProps) {
  const split = text.split('\n');

  return (
    <Paragraph
      style={{
        width: '100%',
        textAlign: 'center',
        padding: 10,
        ...style,
      }}
    >
      {split.length === 1 ? (
        <Text>
          {split[0]}
          <br />
        </Text>
      ) : (
        split.map((subStr, i) => (
          <Text key={i + '_' + subStr}>
            {subStr}
            <br />
          </Text>
        ))
      )}
    </Paragraph>
  );
}

export default FreeText;
