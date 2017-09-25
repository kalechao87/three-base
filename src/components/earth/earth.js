import { Mesh, SphereGeometry, MeshPhongMaterial, Color, TextureLoader } from 'three';
import imageEarth from '../../images/earth4.jpg';
import earthBump from '../../images/earth_bump.jpg';
import earthSpec from '../../images/earth_spec.jpg';

const loader = new TextureLoader();
loader.crossOrigin = '';

export default function createEath() {
  return new Mesh(
    new SphereGeometry(5, 32, 32),
    new MeshPhongMaterial({
      map: loader.load(imageEarth),
      bumpMap: loader.load(earthBump),
      bumpScale: 0.15,
      specularMap: loader.load(earthSpec),
      specular: new Color('#909090'),
      shininess: 5,
    }),
  );
}
