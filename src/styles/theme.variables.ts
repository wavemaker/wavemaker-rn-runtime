export class ThemeVariables {
    primaryColor = '#007bff';
    primaryContrastColor = '#ffffff';
    secondaryColor = '#6c757d';
    successColor = '#28a745';
    infoColor = '#17a2b8';
    warningColor = '#ffc107';
    dangerColor = '#dc3545';
    lightColor = '#f8f9fa';
    darkColor = '#343a40';
    borderColor = '#0003';

    // Navbar variables
    navbarBackgroundColor = this.primaryColor;
    navbarTextColor = '#ffffff';
    navbarIconSize = 24;
    navbarFontSize = 15;
    navbarImageSize = 24;

    //Anchor variables
    linkPrimaryColor = this.primaryColor;
    linkSecondaryColor = this.secondaryColor;
    linkSuccessColor = this.successColor;
    linkInfoColor = this.infoColor;
    linkWarningColor = this.warningColor;
    linkDangerColor = this.dangerColor;
    linkLightColor = this.lightColor;
    linkDarkColor = this.darkColor;
    linkBadgeBackgroundColor = '#f50057';
    linkBadgeTextColor = '#ff0000';
    anchorTextPadding = 2;

    //Grid Layout variables
    layoutGridBorderColor = this.borderColor;
    gridColumnBorderColor = this.borderColor;

    //Spinner Variables
    spinnerIconColor = this.primaryColor;

    //tabbar variables
    tabbarBackgroundColor = this.primaryColor;
    tabbarTextColor =  this.primaryContrastColor;
    tabbarIconColor = this.primaryContrastColor;
}

export default new ThemeVariables();
