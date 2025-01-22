import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";

export function MenuListDropDown({ onChange }) { 
  const handleMenuItemClick = (menuItem) => {
    onChange(menuItem); 
  };

  return (
    <Menu>
      <MenuHandler className="p-0 font-medium test-sm normal-case shadow-none hover:shadow-none hover:border-none bg-white text-black">
        <Button
          className="normal-case flex flex-row items-center"
          style={{ fontSize: "0.875rem", fontWeight: "500" }}
        >
          Company
        </Button>
      </MenuHandler>
      <MenuList 
        className="max-h-60 overflow-y-auto rounded-md bg-white shadow-md" 
      > 
        <MenuItem onClick={() => handleMenuItemClick("AzureBackupRG_centralindia_1")}>AzureBackupRG_centralindia_1</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("cloud-shell-storage-centralindia")}>cloud-shell-storage-centralindia</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("dashboards")}>dashboards</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("DefaultResourceGroup-CIN")}>DefaultResourceGroup-CIN</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("DefaultResourceGroup-EUS")}>DefaultResourceGroup-EUS</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("MC_pgr-prod_pgr-prod-ask_centralindia")}>MC_pgr-prod_pgr-prod-ask_centralindia</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("MC_pgr-uat_pgr-uat-clusters_centralindia")}>MC_pgr-uat_pgr-uat-clusters_centralindia</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("mis-dev")}>mis-dev</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("mis-uat")}>mis-uat</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("NetworkWatcherRG")}>NetworkWatcherRG</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("pgr-dev")}>pgr-dev</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("pgr-dev_pgr-dev-akscluster_centralindia")}>pgr-dev_pgr-dev-akscluster_centralindia</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("pgr-prod")}>pgr-prod</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("pgr-uat")}>pgr-uat</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("repair-GisServer-20230405181314")}>repair-GisServer-20230405181314</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("Survey-App-RG")}>Survey-App-RG</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("webel-credentials-rg")}>webel-credentials-rg</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("webel-log-RG")}>webel-log-RG</MenuItem>
      </MenuList>
    </Menu>
  );
}