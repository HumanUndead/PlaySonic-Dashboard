import { IHttpClient } from "@domain/entities/protocols/http";
import { ISlotTypeBody, ISlotTypeQuery } from "@domain/entities/SlotType/SlotType";
import { HttpStatusCode } from "@domain/enums";
import { InvalidCredentialsError, UnexpectedError } from "@domain/errors";
import { BadRequestError } from "@domain/errors/BadRequestError";
import { NotFoundError } from "@domain/errors/NotFoundError";
import { ServerError } from "@domain/errors/ServerError";
import { IQuery } from "@domain/primitives/query/IQuery";
import { makeAxiosHttpClient } from "@main/factories/http/AxiosHttpClient";

export class SlotTypeQuery implements ISlotTypeQuery, IQuery {
  constructor(private readonly httpPostClient: IHttpClient) { }

  async getSlotTypeList(url: string): Promise<ISlotTypeBody> {
    const httpResponse = await this.httpPostClient.getRequest({ url });
    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok:
        return httpResponse.data.value;
      case HttpStatusCode.coustomError:
        throw new Error(httpResponse.data?.message);
      case HttpStatusCode.unauthorized:
        throw new InvalidCredentialsError();
      case HttpStatusCode.notFound:
        throw new NotFoundError();
      case HttpStatusCode.badRequest:
        throw new BadRequestError();
      case HttpStatusCode.serverError:
        throw new ServerError();
      default:
        throw new UnexpectedError();
    }
  }
}
export const SlotTypeQueryInstance = new SlotTypeQuery(
  makeAxiosHttpClient()
);
