import React, { useMemo } from "react";
import { SelectField } from "./SelectField";
import { Country, State, City } from "country-state-city";
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from "react-hook-form";

export interface CountryStateCitySelectorProps {
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  errors: FieldErrors<any>;
}

export function CountryStateCitySelector({
  register,
  watch,
  setValue,
  errors,
}: CountryStateCitySelectorProps) {
  const selectedCountry = watch("country");
  const selectedState = watch("state");
  const selectedCity = watch("city");

  const countries = useMemo(() => {
    return Country.getAllCountries().map((country) => ({
      label: country.name,
      value: country.isoCode,
    }));
  }, []);

  const states = useMemo(() => {
    if (!selectedCountry) return [];
    return State.getStatesOfCountry(selectedCountry).map((state) => ({
      label: state.name,
      value: state.isoCode,
    }));
  }, [selectedCountry]);

  const cities = useMemo(() => {
    if (!selectedCountry || !selectedState) return [];
    return City.getCitiesOfState(selectedCountry, selectedState).map((city) => ({
      label: city.name,
      value: city.name,
    }));
  }, [selectedCountry, selectedState]);

  const countryRegister = register("country");
  const stateRegister = register("state");
  const cityRegister = register("city");

  return (
    <>
      <SelectField
        label="Country"
        placeholder="Select Country"
        options={countries}
        {...countryRegister}
        value={selectedCountry}
        onChange={(e) => {
          countryRegister.onChange(e);
          setValue("state", "", { shouldValidate: true });
          setValue("city", "", { shouldValidate: true });
        }}
        errorMessage={errors.country?.message as string | undefined}
      />
      <SelectField
        label="State"
        placeholder="Select State"
        options={states}
        disabled={!selectedCountry}
        {...stateRegister}
        value={selectedState}
        onChange={(e) => {
          stateRegister.onChange(e);
          setValue("city", "", { shouldValidate: true });
        }}
        errorMessage={errors.state?.message as string | undefined}
      />
      <SelectField
        label="City"
        placeholder="Select City"
        options={cities}
        disabled={!selectedState}
        {...cityRegister}
        value={selectedCity}
        errorMessage={errors.city?.message as string | undefined}
      />
    </>
  );
}
