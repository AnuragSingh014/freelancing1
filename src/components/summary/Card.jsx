import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Button,
  } from "@material-tailwind/react";
   import { Link } from "react-router";

  export function Pamplet(props) {
    return (
      <Card className="mt-6 w-96">
        
        <CardHeader color="blue-gray" className="relative h-56">
          <img
            src={props.url}
            alt="card-image"
          />
        </CardHeader>
        <CardBody>
          <Typography variant="h5" color="blue-gray" className="mb-2">
            {props.heading}
          </Typography>
          <Typography>
           {props.title}
          </Typography>
        </CardBody>
        <CardFooter className="pt-0 flex items-end justify-end">
        <Link to={props.route}>
          <Button className="bg-white text-black font-normal text-md">Open</Button>
        </Link>
        </CardFooter>
      </Card>
    );
  }