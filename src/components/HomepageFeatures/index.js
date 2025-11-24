import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Bonding Curve Pricing',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Quadratic bonding curve ensures fair token distribution with increasing prices as supply grows. 
        70% of tokens available via curve, 30% held for liquidity migration.
      </>
    ),
  },
  {
    title: 'Automated Liquidity Migration',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        When the bonding curve completes, liquidity automatically migrates to DEX. 
        No manual intervention required - seamless transition from curve to DEX trading.
      </>
    ),
  },
  {
    title: 'Creator Unlock Rules',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Tokens start locked until creator purchases 2% of supply. Creator limited to 20% of curve supply 
        to ensure fair distribution and prevent manipulation.
      </>
    ),
  },
  {
    title: 'Social Features',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Built-in on-chain comment system allows community engagement. 
        Trading volume tracking and transparent token metadata stored on-chain.
      </>
    ),
  },
  {
    title: 'Smart Treasury Routing',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        2% fee on all transactions automatically routed to treasury. 
        Configurable treasury address with no manual intervention needed.
      </>
    ),
  },
  {
    title: 'Comprehensive Documentation',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Complete technical reference covering architecture, smart contracts, API integration, 
        deployment workflows, and security considerations.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
