export interface IDDlOption {
  value: number | boolean | string;
  label: string;
  image?: string | undefined;
  service?: number | undefined;

  otherValues?: { [type: string]: { value: number | boolean | string } };
}

export interface IDDlOptionCourt extends IDDlOption {
  isIndoor?: boolean;
}

export interface IDDlOptionClub {
  value: number;
  label: string;
  image?: string | undefined;
  service?: number | undefined;

  otherValues?: { [type: string]: { value: number | boolean | string } };
}

export interface IDDlOptionSlotType {
  value: number;
  label: number;
  image?: string | undefined;
  service?: number | undefined;

  otherValues?: { [type: string]: { value: number | boolean | string } };
}
