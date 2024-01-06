/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from 'react';
import {
  Autocomplete,
  CircularProgress,
  TextField,
  debounce,
} from '@mui/material';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

interface ComponentProps<Option> {
  id: string;
  value: string;
  label: string;
  noOptionsText: string;
  placeholder: string;
  endpoint: string;
  query: string;
  clearOnBlur?: boolean,
  size?: 'small' | 'medium';
  getOptionLabel: (option: Option) => string;
  setValue: (newValue: string) => void;
  isOptionEqualToValue: (option: Option, value: Option) => boolean;
}

export default function AutoComplete<Option>(props: ComponentProps<Option>) {
  const {
    id,
    value,
    label,
    noOptionsText,
    placeholder,
    size,
    endpoint,
    query,
    clearOnBlur,
    setValue,
    getOptionLabel,
    isOptionEqualToValue,
  } = props;

  const axios = useAxiosPrivate();
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [controller, setController] = useState<AbortController | null>(null);

  const fetchResults = useMemo(() => {
    return debounce(async (newValue: ReturnType<() => typeof value>) => {
      // If there's an ongoing request, cancel it
      if (controller) {
        controller.abort();
        setController(null);
      }

      if (!newValue) {
        setOptions([]);
        setLoading(false);
        return;
      }

      // Create a new AbortController for the current request
      setController(new AbortController());
      setLoading(true);

      try {
        const response = await axios.get(endpoint, {
          params: { [query]: newValue },
          signal: controller?.signal,
        });

        const data: Option[] = response.data as Option[];
        setOptions(data);
      } finally {
        setLoading(false);
      }
    }, 500);
  }, [axios]);

  useEffect(() => {
    fetchResults(value);
    return controller?.abort();
  }, [value]);

  return (
    <Autocomplete
      size={size ? size : 'small'}
      id={id}
      clearOnBlur={clearOnBlur}
      autoComplete
      includeInputInList
      options={options}
      inputValue={value}
      loading={loading}
      noOptionsText={noOptionsText}
      filterOptions={(x) => x}
      getOptionLabel={getOptionLabel}
      onInputChange={(_, value) => setValue(value)}
      isOptionEqualToValue={isOptionEqualToValue}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}
