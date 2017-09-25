import { Mesh, SphereGeometry, MeshPhongMaterial, AdditiveBlending, TextureLoader } from 'three';

import earthCloud from '../../images/earth_cloud.png';

const loader = new TextureLoader();
loader.crossOrigin = '';

export default function createCloud() {
  return new Mesh(
    new SphereGeometry(5, 40, 40),
    new MeshPhongMaterial({
      map: loader.load(earthCloud),
      transparent: true,
      opacity: 1,
      blending: AdditiveBlending,
    }),
  );
}
