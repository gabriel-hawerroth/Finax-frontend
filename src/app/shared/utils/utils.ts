import { ButtonType } from '../../core/enums/button-style';

export const cloudFireCdnLink: string = 'https://d3dpbaewouik5z.cloudfront.net';
export const cloudFireCdnImgsLink: string =
  'https://d3dpbaewouik5z.cloudfront.net/imgs/';

export function getBtnStyle(style: string): ButtonType {
  switch (style) {
    case 'basic':
      return ButtonType.BASIC;
    case 'raised':
      return ButtonType.RAISED;
    case 'stroked':
      return ButtonType.STROKED;
    case 'flat':
      return ButtonType.FLAT;
    case 'icon':
      return ButtonType.ICON;
    case 'fab':
      return ButtonType.FAB;
    case 'mini-fab':
      return ButtonType.MINI_FAB;
    case 'extended-fab':
      return ButtonType.EXTENDED_FAB;
    default:
      return ButtonType.BASIC;
  }
}
