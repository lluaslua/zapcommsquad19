import React from 'react';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& label.Mui-focused': {
            color: '#0C2454',borderRadius: '60px'
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: '#0C2454',borderRadius: '60px'
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#0C2454',borderRadius: '60px'
            },
            '&:hover fieldset': {
              borderColor: '#0C2454',borderRadius: '60px'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#0C2454',borderRadius: '60px'
            },
          },
        },
      },
    },
  },
});

function CustomTextField() {
  return (
    <ThemeProvider theme={theme}>
      <TextField label='Pesquisar...' variant="outlined"/>
    </ThemeProvider>
  );
}

export default CustomTextField;