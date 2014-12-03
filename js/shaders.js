		<script id="fragmentCompute1" type="x-shader/x-fragment">
			precision highp float;
			precision highp int;

			varying vec2 vUv;
			uniform highp sampler2D tDiffuse1;
			uniform highp sampler2D tDiffuse2;
			uniform highp sampler2D tDiffuse3;
			uniform highp float currTime;

			void main() {
				float omega=0.25; 
				//float density=1.0; 
				float t1=4./9.; 
				float t2=1./9.; 
				float t3=1./36.; 
				float c_squ=1./3.;

				vec4 v1 = texture2D( tDiffuse1, vUv);
				vec4 v2 = texture2D( tDiffuse2, vUv);
				vec4 v3 = texture2D( tDiffuse3, vUv);

				float f1 = v1.r;
				float f2 = v1.g;
				float f3 = v1.b;
				 
				float f4 = v2.r;
				float f5 = v2.g;
				float f6 = v2.b;
				 
				float f7 = v3.r;
				float f8 = v3.g;
				float f9 = v3.b;
				
				float density = f1+f2+f3+f4+f5+f6+f7+f8+f9;
				float invDensity = 1./ density;
				float ux = invDensity *(f1+f2+f8-f4-f5-f6);
				float uy = invDensity *(f2+f3+f4-f6-f7-f8);
				if (currTime < 0.1 && (vUv.x < 0.002 )) {
					ux += .02;
				};
				float usqu = ux*ux + uy*uy;
				float uc2 = ux+uy;
				float uc4 = -ux+uy;
				float uc6 = -uc2;
				float uc8 = -uc4;
 
				float feq1 = t2*density*(1. + ux/c_squ+0.5*(ux/c_squ)*(ux/c_squ)- usqu/(2.*c_squ));
				float feq3 = t2*density*(1. + uy/c_squ+0.5*(uy/c_squ)*(uy/c_squ) - usqu/(2.*c_squ));
				float feq5 = t2*density*(1. - ux/c_squ+0.5*(ux/c_squ)*(ux/c_squ)- usqu/(2.*c_squ));
				float feq7 = t2*density*(1. - uy/c_squ+0.5*(uy/c_squ)*(uy/c_squ) - usqu/(2.*c_squ));
 
				float feq2 = t3*density*(1. + uc2/c_squ+0.5*(uc2/c_squ)*(uc2/c_squ)- usqu/(2.*c_squ));
				float feq4 = t3*density*(1. + uc4/c_squ+0.5*(uc4/c_squ)*(uc4/c_squ)- usqu/(2.*c_squ));
				float feq6 = t3*density*(1. + uc6/c_squ+0.5*(uc6/c_squ)*(uc6/c_squ)- usqu/(2.*c_squ));
				float feq8 = t3*density*(1. + uc8/c_squ+0.5*(uc8/c_squ)*(uc8/c_squ)- usqu/(2.*c_squ));
 
				float feq9 = t1*density*(1. - usqu/(2.*c_squ));

				float ff1 = omega * feq1 + (1. - omega) * f1;
				float ff2 = omega * feq2 + (1. - omega) * f2;
				float ff3 = omega * feq3 + (1. - omega) * f3;
					
				gl_FragColor = vec4(ff1,ff2,ff3,1.);

			}

		</script>