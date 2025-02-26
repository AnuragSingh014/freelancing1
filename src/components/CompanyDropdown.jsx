import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";

export function CompanyDropdown({ onChange, selectedCompany }) { 
  const clients = [
    { name: "DIBD", id: "33ea3b3a-5274-4aaa-9a19-b98e5b259a8c" },
    { name: "MORD (NRML)", id: "08ac3ec9-05a7-4624-a7f9-7760f5d0a378" },
    { name: "AICT", id: "73355c15-9038-4a9d-ae15-31e232bc37e3" },
    { name: "KUM", id: "e4211ed5-8d3a-48ad-8d73-ba400c0af811" }
  ];

  const handleMenuItemClick = (client) => {
    onChange(client);
  };

  return (
    <Menu className="border-0">
      <MenuHandler 
        style={{ outline: 'none' }} 
        className="border-0 font-medium text-sm flex items-center justify-center normal-case shadow-none hover:shadow-none hover:border-none bg-blue-100 text-black p-0 px-2 ml-2"
      >
        <Button
          className="normal-case flex flex-row items-center border-0 ml-2"
          style={{ fontSize: "0.875rem", fontWeight: "500", outline: 'none' }}
        >
        {selectedCompany.name }
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
        
        
        </Button>
      </MenuHandler>
      <MenuList 
        className="max-h-60 p-0 overflow-y-auto rounded-md bg-white shadow-md border-0 w-64"
      > 
        {clients.map((client) => (
          <MenuItem key={client.id} onClick={() => handleMenuItemClick(client)}>
            {client.name}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
