/**
 * Created by chongchong on 14-4-22.
 */


var MyParticleStyle=function(){};

MyParticleStyle.WindmillParticle=function(){
   var particleStyle= new ss2d.ParticleStyle();
    particleStyle.rotationValue=3.14;
    particleStyle.a=0.4;
    particleStyle.scaleX=2;
    particleStyle.scaleY=2;
    particleStyle.scaleXValue=-0.03
    particleStyle.speedValue=3;
    return particleStyle;
}
MyParticleStyle.CrossParticle=function(n){
   var particleStyle= new ss2d.ParticleStyle();
      switch (n){
        case 0: particleStyle.rotationValue =0;
            break;
        case 1: particleStyle.rotationValue =1.54;
            break;
        case 2: particleStyle.rotationValue =3.14;
            break;
        case 3: particleStyle.rotationValue =4.71;
            break;
    }
      particleStyle.r =0.3;
    particleStyle.g =0.59;
    particleStyle.b =0.83;
    particleStyle.a =1;
    particleStyle.addR=0;
    particleStyle.addG=0;
    particleStyle.addB=0;
    particleStyle.scaleX=1.2;
    particleStyle.scaleY=1.2;
    particleStyle.scaleXValue=-0.01;
    particleStyle.scaleYValue =-0.01;
    particleStyle.alphaValue =-0.03;
    particleStyle.speedValue=16;
    return particleStyle;
}

MyParticleStyle.TBombParticle=function(n){
   var particleStyle= new ss2d.ParticleStyle();
      switch (n){
        case 0: particleStyle.rotationValue =0;
            break;
        case 1: particleStyle.rotationValue =1.54;
            break;
        case 2: particleStyle.rotationValue =3.14;
            break;
        case 3: particleStyle.rotationValue =4.71;
            break;
    }
      particleStyle.r =0.3;
    particleStyle.g =0.59;
    particleStyle.b =0.83;
    particleStyle.a =0.8;
    particleStyle.addR=0;
    particleStyle.addG=0;
    particleStyle.addB=0;
    particleStyle.scopeX=2;
    particleStyle.scopeY=2;
    particleStyle.scaleX=0.6;
    particleStyle.scaleY=0.6;
    particleStyle.scaleXValue=0.11;
    particleStyle.scaleYValue =0.11;
    particleStyle.alphaValue =-0.04;
    particleStyle.speedValue=3;
    return particleStyle;
}