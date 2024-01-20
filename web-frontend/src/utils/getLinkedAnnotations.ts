import LinkedPeakAnnotation from '../types/peak/LinkedPeakAnnotation';
import Peak from '../types/peak/Peak';
import PeakAnnotation from '../types/peak/PeakAnnotation';

function getLinkedAnnotations(
  peakData: Peak[],
  annotation: PeakAnnotation | undefined,
): LinkedPeakAnnotation[] {
  const linkedPeakAnnotations: LinkedPeakAnnotation[] = [];

  if (annotation && annotation.header && annotation.values) {
    const annotationHeaderIndex = annotation.header.indexOf('m/z');
    if (annotationHeaderIndex !== undefined) {
      peakData.forEach((p) => {
        const idx = annotation.values[annotationHeaderIndex].findIndex(
          (p2) => Number(p2) === Number(p.mz.toFixed(4)),
        );
        linkedPeakAnnotations.push({
          annotationHeaderIndex,
          annotationIndex: idx,
        });
      });
    }
  }

  return linkedPeakAnnotations;
}

export default getLinkedAnnotations;
