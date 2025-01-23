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
    <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
      <div className="mb-2 p-4">
        <Typography variant="h5" color="blue-gray">
          Sidebar
        </Typography>
      </div>
      <List>

      <Link to="/">
        <ListItem>
          <ListItemPrefix>
            <PresentationChartBarIcon className="h-5 w-5" />
          </ListItemPrefix>
         Summary
        </ListItem>
        </Link>

        <Link to="/advisory">
          <ListItem>
            <ListItemPrefix>
              <ShoppingBagIcon className="h-5 w-5" />
            </ListItemPrefix>
            Advisory
          </ListItem>
        </Link>

        <Link to="/instances">
          <ListItem>
            <ListItemPrefix>
              <InboxIcon className="h-5 w-5" />
            </ListItemPrefix>
            Instances
            <ListItemSuffix>
              <Chip
                value="14"
                size="sm"
                variant="ghost"
                color="blue-gray"
                className="rounded-full"
              />
            </ListItemSuffix>
          </ListItem>
        </Link>

        <Link to="/expense">
          <ListItem>
            <ListItemPrefix>
              <UserCircleIcon className="h-5 w-5" />
            </ListItemPrefix>
            Expense
          </ListItem>
        </Link>
      </List>
    </Card>
  );
}
