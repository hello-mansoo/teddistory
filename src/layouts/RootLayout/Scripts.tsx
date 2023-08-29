import Script from "next/script"
import { CONFIG } from "site.config"

const Scripts: React.FC = () => (
  <>
    {CONFIG?.googleAnalytics?.enable === true && (
      <>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${CONFIG.googleAnalytics.config.measurementId}`}
        />
        <Script strategy="lazyOnload" id="ga">
          {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${CONFIG.googleAnalytics.config.measurementId}', {
              page_path: window.location.pathname,
            });`}
        </Script>
      </>
    )}
    {CONFIG.jenniferFront?.enable === true && (
      <Script strategy="lazyOnload" id="jenniferFront">
      {`(function(j,ennifer) {
          j['dmndata']=[];j['jenniferFront']=function(args){window.dmndata.push(args)};
          j['dmnaid']=ennifer;j['dmnatime']=new Date();j['dmnanocookie']=false;j['dmnajennifer']='JENNIFER_FRONT@INTG';
        }(window, '${CONFIG.jenniferFront.config.id}'));`}
    </Script>
    )}
  </>
)

export default Scripts
