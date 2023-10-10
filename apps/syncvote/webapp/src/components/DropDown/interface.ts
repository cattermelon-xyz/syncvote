export interface DropDownItem {
  value: string | number;
  label: string | number;
}

export interface IDropDownProps {
  items: DropDownItem[];
  selectedItems: DropDownItem[];
  label?: string;
  labelClass?: string;
  buttonClass?: string;
  selectClass?: string;
  itemClass?: string;
  iconItemEnd?: React.ReactNode;
  onSelect: (selectedItems: DropDownItem[]) => void;
}
