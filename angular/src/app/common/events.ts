import * as ConstSocket from '@app/common/constSocket';
import { Product } from '@app/core/services/common/webservice.service';

interface Error {
    error: string;
}

interface Success<T> {
    data: T;
}

export type Response<T> = Error | Success<T>;

export interface ServerEvents {
    "DemoCreatePorduct": (product: Product) => void;
    "DemoUpdatePorduct": (product: Product) => void;
    "DemoDeletePorduct": (id: string) => void;
  }

export interface ClientEvents {
    // demo product
    "DemoListProduct" : (callback: (res: Response<Product[]>) => void) => void;
    "DemoCreatePorduct" : (
        payload: Omit<Product, "id">,
        callback: (res: Response<number>) => void
      ) => void;

    "DemoUpdatePorduct":  (
        payload: Product,
        callback: (res?: Response<void>) => void
    ) => void;

    "DemoDeletePorduct": (id: number, callback: (res?: Response<void>) => void) => void;
}