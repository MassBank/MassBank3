import { message } from 'antd';

async function copyTextToClipboard(label: string, value: string) {
  try {
    await navigator.clipboard.writeText(value);
    return message.success('Copied "' + label + '" to clipboard!');
  } catch (error) {
    return message.error(
      'Failed to copy "' + label + '" to clipboard: ' + error,
    );
  }
}

export default copyTextToClipboard;
