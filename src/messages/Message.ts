import { bold, white } from "colors/safe";
import { template } from "lodash";
import { ERROR, INFO, WARN } from "../constants/log.constants";
import { REF_URL } from "../constants/reference-docs.constants";

export default class Message {
  private referenceNumber: number;
  private type: LOG_INFO | LOG_WARN | LOG_ERROR;
  private message: string;

  constructor(type, referenceNumber, message) {
    this.type = type;
    this.referenceNumber = referenceNumber;
    this.message = message;
  }

  public get(additionalData: object = {}) {
    const code = `WER-${this.getPrefix()}${this.referenceNumber}`;
    const refLink = bold(white(`${REF_URL}#${code}`));
    return `[${code}] ${template(
      this.message,
      additionalData,
    )}.\nVisit ${refLink} for complete details\n`;
  }

  public toString() {
    return this.get();
  }

  private getPrefix() {
    switch (this.type) {
      case INFO:
        return "I";
      case WARN:
        return "W";
      case ERROR:
        return "E";
    }
  }
}
