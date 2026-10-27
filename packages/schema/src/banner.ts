/**
 * 배너 UI를 정의하는 스키마.
 * remote-banner-editor는 이 스키마의 fields로 폼을, 값으로 미리보기를 그린다.
 */
export type BannerFieldType = 'text' | 'textarea' | 'color' | 'url' | 'select' | 'boolean';

export interface BannerFieldBase<T extends BannerFieldType> {
  key: string;
  type: T;
  label: string;
  required?: boolean;
}

export interface TextField extends BannerFieldBase<'text' | 'textarea' | 'url'> {
  maxLength?: number;
}

export interface ColorField extends BannerFieldBase<'color'> {}

export interface SelectField extends BannerFieldBase<'select'> {
  options: { label: string; value: string }[];
}

export interface BooleanField extends BannerFieldBase<'boolean'> {}

export type BannerField = TextField | ColorField | SelectField | BooleanField;

export interface BannerSchema {
  version: 1;
  name: string;
  fields: BannerField[];
}

export type BannerValues = Record<string, string | boolean>;
