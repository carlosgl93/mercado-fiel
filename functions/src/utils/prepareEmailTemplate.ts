import { getStorage } from 'firebase-admin/storage';
/**;
 *
 * @param  templateName: string, name of the html template to fetch from firebase storage
 * @returns  Returns the template's html parsed to string so that it can be input to handlebars 
 *
 */

export async function fetchAndCompileTemplate(templateName: string): Promise<string> {
  const bucket = getStorage().bucket();
  const file = bucket.file(templateName);
  const [templateContent] = await file.download();
  return templateContent.toString();
}
