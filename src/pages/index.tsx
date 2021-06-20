import { GetServerSideProps } from "next";
import { Formik, Form, Field, useField, useFormikContext } from "formik";
import {
  Paper,
  Grid,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  SelectProps,
  Button,
} from "@material-ui/core";
import { getMakes, Make } from "../database/getMakes";
import { getModels, Model } from "../database/getModels";
import { makeStyles } from "@material-ui/core/styles";
import router, { useRouter } from "next/router";
import { getAsString } from "../getAsString";
import useSWR from "swr";

export interface SearchProps {
  makes: Make[];
  models: Model[];
  singleColumn?: boolean;
}

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: "auto",
    maxWidth: 500,
    padding: theme.spacing(3),
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const prices = [500, 1000, 5000, 15000, 25000, 50000, 2500000];

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function Search({ makes, models, singleColumn }: SearchProps) {
  const classes = useStyles();
  const { query } = useRouter();
  const smValue = singleColumn ? 12 : 6;

  const initialValues = {
    make: getAsString(query.make!) || "all",
    model: getAsString(query.model!) || "all",
    minPrice: getAsString(query.minPrice!) || "all",
    maxPrice: getAsString(query.maxPrice!) || "all",
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        router.push(
          {
            pathname: "/cars",
            query: { ...values, page: 1 },
          },
          undefined,
          { shallow: true }
        );
      }}
    >
      {({ values }) => (
        <Form>
          <Paper elevation={5} className={classes.paper}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={smValue}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="search-make">Make</InputLabel>
                  <Field
                    name="make"
                    as={Select}
                    labelId="search-make"
                    label="Make"
                  >
                    <MenuItem value="all">
                      <em>All Makes</em>
                    </MenuItem>
                    {makes.map((make) => (
                      <MenuItem value={make.make} key={make.make}>
                        {`${make.make} (${make.count})`}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={smValue}>
                <ModelSelect name="model" models={models} make={values.make} />
              </Grid>
              <Grid item xs={12} sm={smValue}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="search-min-price">Min Price</InputLabel>
                  <Field
                    name="minPrice"
                    as={Select}
                    labelId="search-min-price"
                    label="Min Price"
                  >
                    <MenuItem value="all">
                      <em>No Min</em>
                    </MenuItem>
                    {prices.map((price, idx) => (
                      <MenuItem value={price} key={idx}>
                        {formatter.format(price)}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={smValue}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="search-max-price">Max Price</InputLabel>
                  <Field
                    name="maxPrice"
                    as={Select}
                    labelId="search-max-price"
                    label="Max Price"
                  >
                    <MenuItem value="all">
                      <em>No Max</em>
                    </MenuItem>
                    {prices.map((price, idx) => (
                      <MenuItem value={price} key={idx}>
                        {formatter.format(price)}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  fullWidth
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Form>
      )}
    </Formik>
  );
}

export interface ModelSelectProps extends SelectProps {
  name: string;
  models: Model[];
  make: string;
}

export function ModelSelect({ models, make, ...props }: ModelSelectProps) {
  const { setFieldValue } = useFormikContext();
  const [field] = useField({
    name: props.name,
  });

  const { data } = useSWR("/api/models/?make=" + make, {
    dedupingInterval: 60000,
    onSuccess: (newValues) => {
      if (!newValues.map((a?: any) => a.model).includes(field.value)) {
        // we want to make this field to all
        setFieldValue("model", "all");
      }
    },
  });
  const newModels = data || models;
  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel id="search-model">Model</InputLabel>
      <Select labelId="search-model" label="Model" {...field} {...props}>
        <MenuItem value="all">
          <em>All Models</em>
        </MenuItem>
        {newModels.map((model: any) => (
          <MenuItem value={model.model} key={model.model}>
            {`${model.model} (${model.count})`}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const make = getAsString(ctx.query.make!);
  const [makes, models] = await Promise.all([getMakes(), getModels(make)]);
  return { props: { makes, models } };
};
