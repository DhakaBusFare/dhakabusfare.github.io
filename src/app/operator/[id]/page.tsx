import OperatorDetailClient from './OperatorDetailClient';

export function generateStaticParams() {
  return [
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

export default function Page({ params }: { params: { id: string } }) {
  return <OperatorDetailClient params={params} />;
}
