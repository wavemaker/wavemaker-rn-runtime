import BASE_THEME from '@wavemaker/rn-runtime/styles/theme';

export const DEFAULT_CLASS = 'app-button';
export const DEFAULT_STYLES = {
    root: {
        backgroundColor: 'blue',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        margin: 5
    },
    text: {
        textAlign: "center",
        color: "#ffffff"
    }
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
BASE_THEME.addStyle('btn-success', DEFAULT_CLASS, {
  button: {
      backgroundColor: 'green'
  }
});
BASE_THEME.addStyle('btn-danger', DEFAULT_CLASS, {
  button: {
      backgroundColor: 'red'
  }
});