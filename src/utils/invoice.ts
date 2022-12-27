import { AxiosResponse } from 'axios';
import { saveAs } from 'file-saver';

import PayInApi from 'service/payin';

export function download(payInKey: string) {
  const api = new PayInApi();

  api.downloadInvoice(payInKey)
    .then((response) => {
      const fileName = getFilenameFromHeader(response);
      saveAs(response.data, fileName);
    });
}

function getFilenameFromHeader(response: AxiosResponse<Blob>): string {
  const contentDisposition = response.headers['content-disposition'];
  const defaultName = 'invoice.pdf';
  if (!contentDisposition) {
    return defaultName;
  }
  const filenamePart = contentDisposition.split(';')[1];
  if (!filenamePart) {
    return defaultName;
  }
  return filenamePart.split('filename')[1].split('=')[1].trim();
}