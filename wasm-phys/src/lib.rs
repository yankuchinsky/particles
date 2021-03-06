mod utils;
extern crate rand;
extern crate js_sys;
use std;
use rand::Rng;
use js_sys::{Float32Array};
use wasm_bindgen::prelude::*;

// #![feature(stdsimd)]
// #![cfg(target_feature = "simd128")]
// #![cfg(target_arch = "wasm32")]

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    // Use `js_namespace` here to bind `console.log(..)` instead of just
    // `log(..)`
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);

    // The `console.log` is quite polymorphic, so we can bind it with multiple
    // signatures. Note that we need to use `js_name` to ensure we always call
    // `log` in JS.
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_u32(a: u32);

    // Multiple arguments too!
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_many(a: &str, b: &str);
}

#[wasm_bindgen]
pub extern fn particlesToNewPoints(particles: Float32Array) -> Vec<f32> {
  let mut i = 0;
  let mut points = Vec::<f32>::new();

  while i < particles.length() {

    points.push(particles.get_index(i));
    points.push(particles.get_index(i + 1));

    i = i + 4;
  }

  return points;
} 


#[wasm_bindgen]
pub extern fn initParticles(particles: Float32Array, x:f32, y:f32) {
  let mut i = 0;
  let mut _rnd = rand::thread_rng();

  while i < particles.length() {

    particles.set_index(i, x);
    particles.set_index(i + 1, y);
    
    let d: f32 = _rnd.gen::<f32>().sqrt() * 10.0;
    let ang: f32 = _rnd.gen::<f32>() * 3.14 * 20.0;
    
    particles.set_index(i + 2, ang.cos() * d / 1000.0);
    particles.set_index(i + 3, ang.sin() * d / 1000.0);

    i = i + 4;
  }
}


#[wasm_bindgen]
pub extern fn initParticlesWithPoints(particles: Float32Array, points: Float32Array, sub_particles: i32) {
  let mut i = 0;
  let mut y = 0;
  let mut ptc = 0;
  let mut _rnd = rand::thread_rng();

  while i < particles.length() {

    particles.set_index(i, points.get_index(y));
    particles.set_index(i + 1, points.get_index(y + 1));
    
    let d: f32 = _rnd.gen::<f32>().sqrt() * 10.0;
    let ang: f32 = _rnd.gen::<f32>() * 3.14 * 20.0;
    
    particles.set_index(i + 2, ang.cos() * d / 1000.0);
    particles.set_index(i + 3, ang.sin() * d / 1000.0);

    if ptc == sub_particles {
      ptc = 0;
      y = y + 2;
    } else {
      ptc += 1;
    }

    i = i + 4;
  }
}

#[wasm_bindgen]
pub extern fn moveParticles(particles: &Float32Array) {
  let mut i = 0;
  let mut rng = rand::thread_rng();

  while i < particles.length() {
    
    particles.set_index(i, particles.get_index(i) + particles.get_index(i + 2));
    particles.set_index(i + 1, particles.get_index(i + 1) + particles.get_index(i + 3));
    particles.set_index(i + 3, particles.get_index(i + 3) - 0.0002);
   
    
    i = i + 4;
  }
}

#[wasm_bindgen]
pub extern fn getColor() -> Vec<u32> {
  let mut _rnd = rand::thread_rng();
  let mut result = Vec::<u32>::new();

  for _ in 0..3 {
    result.push((_rnd.gen::<f32>() * 255.0).round() as u32);
  }
  
  return result.clone();
}

#[wasm_bindgen]
pub extern fn getColorArray(count: u32) -> Vec<f32> { 
  let mut i = 0;
  let mut _rnd = rand::thread_rng();
  let mut result = Vec::<f32>::new();

  loop {
    
    result.push(_rnd.gen::<f32>());
    result.push(_rnd.gen::<f32>());
    result.push(_rnd.gen::<f32>());
    i += 3;

    if i == count { break; }
  }

  return result;

}