import { useReactFlow, getRectOfNodes, getTransformForBounds } from 'reactflow';
import { toPng } from 'html-to-image';
import { ReactNode } from 'react';

function downloadImage(dataUrl: any) {
  const a = document.createElement('a');

  a.setAttribute('download', 'reactflow.png');
  a.setAttribute('href', dataUrl);
  a.click();
}

const imageWidth = 1340;
const imageHeight = 768;

function SaveGraphImage({
  className = '',
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const { getNodes } = useReactFlow();
  const onClick = () => {
    // we calculate a transform for the nodes so that all nodes are visible
    // we then overwrite the transform of the `.react-flow__viewport` element
    // with the style option of the html-to-image library
    const nodesBounds = getRectOfNodes(getNodes());
    const transform = getTransformForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.4,
      10
    );

    toPng(document.querySelector('.react-flow__viewport') as HTMLElement, {
      backgroundColor: '#fff',
      width: imageWidth,
      height: imageHeight,
      skipAutoScale: true,
      style: {
        width: imageWidth + 'px',
        height: imageHeight + 'px',
        transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
      },
    }).then(downloadImage);
  };

  return (
    <div className={`download-btn ${className}`} onClick={onClick}>
      {children}
    </div>
  );
}

export default SaveGraphImage;
