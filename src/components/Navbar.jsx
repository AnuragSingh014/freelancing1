import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  InboxIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import { NavLink, Link } from "react-router";

export function Navbar() {
  return (
    <Card className="flex-1 bg-inherit rounded-none shadow-none border-none h-[100vh] w-full max-w-[14rem] p-4">
      <div className="mb-2 p-4">
        <Typography variant="h5" color="blue-gray flex items-center justify-center">
          <img src="/freelancinglogo.png" className="h-[16vh] ml-6" />
        </Typography>
      </div>
      <List>

      <Link to="/">
        <ListItem className="w-3/4">
          <ListItemPrefix>
            <PresentationChartBarIcon className="h-5 w-5" />
          </ListItemPrefix>
         Summary
        </ListItem>
        </Link>

        <Link to="/advisory">
          <ListItem className="w-3/4">
            <ListItemPrefix>
              <ShoppingBagIcon className="h-5 w-5" />
            </ListItemPrefix>
            Advisory
          </ListItem>
        </Link>

        

        <Link to="/expense">
          <ListItem className="w-3/4">
            <ListItemPrefix>
              <UserCircleIcon className="h-5 w-5" />
            </ListItemPrefix>
            Finops
          </ListItem>
        </Link>

        <Link to="/consumption">
          <ListItem className="w-3/4">
            <ListItemPrefix>
              <UserCircleIcon className="h-5 w-5" />
            </ListItemPrefix>
            Consumption
          </ListItem>
        </Link>

        <Link to="/instances">
          <ListItem className="w-3/4">
            <ListItemPrefix >
              <InboxIcon className="h-5 w-5" />
            </ListItemPrefix>
            Instances
          </ListItem>
        </Link>

      </List>
    </Card>
  );
}
