import fs from "fs/promises"
import path from "path"
import mustache from "mustache";

export class HtmlTemplate {
  async templateFromFile(filePath: string, data: any): Promise<string> {
    const html = await fs.readFile(
      path.join(__dirname, `../email/templates/${filePath}.hbs`) // (1)
    );
    return this.template(html.toString(), data);
  }

  template(html: string, data: any): string {
    return mustache.render(html, data);
  }
}
