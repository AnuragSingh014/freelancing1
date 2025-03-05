import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";

// Company-specific resource groups data structure
const resourceGroups = {
  "e4211ed5-8d3a-48ad-8d73-ba400c0af811": [
    ["DefaultResourceGroup-CID", "KUM Subscription"],
    ["DefaultResourceGroup-null", "KUM Subscription"],
    ["dev-rg", "KUM Subscription"],
    ["NetworkWatcherRG", "KUM Subscription"],
    ["prod-rg", "KUM Subscription"],
    ["rg-common", "KUM Subscription"],
    ["teting", "KUM Subscription"],
    ["uat-rg", "KUM Subscription"]
  ],
  // Add other companies here as needed
  "33ea3b3a-5274-4aaa-9a19-b98e5b259a8c": [
    ["AzureBackupRG_centralindia_1", "Default Subscription"],
    ["cloud-shell-storage-centralindia", "Default Subscription"],
    // ... other default items
  ]
};

export function MenuListDropDown({ onChange, name, selectedCompany }) {
  const handleMenuItemClick = (menuItem) => {
    onChange(menuItem);
  };

  // Get options based on selected company
  const getCompanyOptions = () => {
    if (!selectedCompany?.id) return [];
    return resourceGroups[selectedCompany.id] || resourceGroups.default;
  };

  return (
    <Menu className="border-0">
      <MenuHandler 
        style={{ outline: 'none' }} 
        className="border-0 font-medium text-sm normal-case shadow-none hover:shadow-none hover:border-none bg-orange-300 text-black p-0 ml-2"
      >
        <Button
          className="normal-case flex flex-row items-center border-0 ml-2"
          style={{ fontSize: "0.875rem", fontWeight: "500", outline: 'none' }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth="1.5" 
            stroke="currentColor" 
            className="size-6"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="m19.5 8.25-7.5 7.5-7.5-7.5" 
            />
          </svg>
        </Button>
      </MenuHandler>
      <MenuList 
        className="max-h-60 p-0 overflow-y-auto rounded-md bg-white shadow-md border-0 w-64"
      >
        {getCompanyOptions().map(([value, display], index) => (
          <MenuItem 
            key={index} 
            onClick={() => handleMenuItemClick(value)}
            className="px-4 py-2 hover:bg-gray-100"
          >
            <div className="flex justify-between w-full">
              <span>{value}</span>
              {/* <span className="text-gray-500 text-sm">{display}</span> */}
            </div>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
