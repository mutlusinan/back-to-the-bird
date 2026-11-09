import '../../theme/tokens.css';
import '../../features/surfaces/style.css';
import '../../features/branding/style.css';
import '../../features/radius/style.css';
import '../../features/icons/style.css';
import { main } from './main';

export default defineContentScript({
  matches: ['https://x.com/*'],
  runAt: 'document_start',
  allFrames: true,
  cssInjectionMode: 'manifest',
  main() {
    void main({ doc: document, win: window });
  },
});
