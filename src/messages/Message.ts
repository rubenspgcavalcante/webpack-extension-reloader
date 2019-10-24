import { INFO, WARN, ERROR } from "../constants/log.constants";
import { REF_URL } from "../constants/reference-docs.constants";
import { white, bold } from "colors/safe";
import { template } from "lodash";

export default class Message {
  private referenceNumber: number;
  private type: LOG_INFO | LOG_WARN | LOG_ERROR;
  private message: string;

  constructor(type, referenceNumber, message) {
    this.type = type;
    this.referenceNumber = referenceNumber;
    this.message = message;
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

  public get(additionalData: object = {}) {
    const code = `WER-${this.getPrefix()}${this.referenceNumber}`;
    const refLink = bold(white(`${REF_URL}#${code}`));
    return `[${code}] ${template(
      this.message,
      additionalData
    )}.\nVisit ${refLink} for complete details\n`;
  }

  toString() {
    return this.get();
  }
}
