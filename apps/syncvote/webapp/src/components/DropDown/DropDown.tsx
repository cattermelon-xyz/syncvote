import DropDownIcon from '@assets/icons/svg-icons/DropDownIcon';
import { useState } from 'react';
import { DropDownItem, IDropDownProps } from './interface';

const DropDown: React.FC<IDropDownProps> = ({
  items,
  selectedItems,
  label = '',
  iconItemEnd = '',
  buttonClass = '',
  selectClass = '',
  itemClass = '',
  labelClass = '',
  onSelect = (a: DropDownItem[]) => {},
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (item: DropDownItem) => {
    const index = selectedItems.findIndex((selectedItem) => selectedItem.value === item.value);
    if (index === -1) {
      onSelect([...selectedItems, item]);
    } else {
      onSelect(selectedItems.filter((selectedItem) => selectedItem.value !== item.value));
    }
    setIsOpen(!isOpen);
  };

  const hoverSelectedItems = (item: DropDownItem) => {
    const index = selectedItems.findIndex((selectedItem) => selectedItem.value === item.value);
    if (index !== -1) {
      return 'bg-gray-200';
    }
    return '';
  };

  const chooseLabel = () => {
    if (label === '') {
      return selectedItems.map((item) => (
        <span key={item.label} className={`${labelClass} mx-1`}>
          {item.label}
        </span>
      ));
    }
    if (selectedItems.length > 0) {
      return selectedItems.map((item) => (
        <span key={item.label} className={`${labelClass} mx-1`}>
          {item.label}
        </span>
      ));
    }
    return <span className={labelClass}>{label}</span>;
  };

  return (
    <div className="relative inline-block text-left h-full w-full">
      <div>
        <button
          type="button"
          className={`dropdown-button ${buttonClass}`}
          id="options-menu"
          onClick={toggleDropdown}
        >
          <span className="gap-4">{chooseLabel()}</span>
          <DropDownIcon />
        </button>
      </div>
      {isOpen && (
        <div className={`dropdown-select ${selectClass}`}>
          <div className="py-1">
            {items.map((item) => (
              <button
                key={item.value}
                className={`${hoverSelectedItems(item)} dropdown-select-item`}
                onClick={() => handleItemClick(item)}
              >
                <span className={itemClass}>{item.label}</span>
                {iconItemEnd}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropDown;
