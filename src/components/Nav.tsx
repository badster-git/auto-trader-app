import { Container } from "@material-ui/core";
import {
  AppBar,
  Button,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import Link from "next/link";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  anchorText: {
    color: theme.palette.primary.dark,
    textDecoration: "none",
  },
}));

export function Nav() {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar variant="dense">
        <Container disableGutters maxWidth="xl">
          <Typography variant="h6" className={classes.title}>
            <Link href="/">
              <a className={classes.anchorText}>Vehicle Trader</a>
            </Link>
          </Typography>
        </Container>

        <Button color="inherit">
          <Link href="/">
            <a className={classes.anchorText}>
              <Typography color="inherit">Home</Typography>
            </a>
          </Link>
        </Button>

        <Button color="inherit">
          <Link href="/faq">
            <a className={classes.anchorText}>
              <Typography color="inherit">FAQ</Typography>
            </a>
          </Link>
        </Button>
      </Toolbar>
    </AppBar>
  );
}
