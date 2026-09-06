import RouteDetailsClient from './RouteDetailsClient';

export function generateStaticParams() {
  return [
    { id: 'new' },
    { id: 'route-b1' },
    { id: 'route-b2' },
    { id: 'route-b3' },
    { id: 'route-b4' },
    { id: 'route-b5' },
    { id: 'b1' },
    { id: 'b2' },
    { id: 'b3' },
    { id: 'b4' },
    { id: 'b5' },
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
}

export default function Page() {
  return <RouteDetailsClient />;
}
