import { join } from 'path';

import { SeedConfig } from './seed.config';

/**
 * This class extends the basic seed configuration, allowing for project specific overrides. A few examples can be found
 * below.
 */
export class ProjectConfig extends SeedConfig {

  PROJECT_TASKS_DIR = join(process.cwd(), this.TOOLS_DIR, 'tasks', 'project');

  FONTS_DEST = `${this.APP_DEST}/fonts`;
  FONTS_SRC = [
    `${this.ASSETS_SRC}/fonts/**`
  ];

  constructor() {
    super();
    this.APP_TITLE = 'Rainforest Connection';

    /**
     * The flag to enable handling of SCSS files
     * The default value is false. Override with the '--scss' flag.
     * @type {boolean}
     */
    this.ENABLE_SCSS = true;
    /* Enable typeless compiler runs (faster) between typed compiler runs. */
    // this.TYPED_COMPILE_INTERVAL = 5;

    // Add `NPM` third-party libraries to be injected/bundled.
    this.NPM_DEPENDENCIES = [
      ...this.NPM_DEPENDENCIES,
      {src: 'jquery/dist/jquery.min.js', inject: 'libs'},
      {src: 'bootstrap/dist/js/bootstrap.min.js', inject: 'libs'},
      {src: 'bootstrap/dist/css/bootstrap.min.css', inject: true}, // inject into css section
      {src: 'normalize.css/normalize.css', inject: true},
      {src: 'leaflet/dist/leaflet.css', inject: true},
      {src: 'moment/moment.js', inject: 'libs'},
      {src: 'moment-timezone/builds/moment-timezone-with-data-2010-2020.js', inject: 'libs'},
      {src: 'eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js', inject: 'libs'},
      {src: 'eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.css', inject: true}
    ];

    // Add `local` third-party libraries to be injected/bundled.
    this.APP_ASSETS = [
      ...this.APP_ASSETS,
      {src: `${this.CSS_SRC}/custom.css`, inject: true, vendor: false},
      {src: `${this.CSS_SRC}/icomoon.css`, inject: true, vendor: false},
      {src: `${this.CSS_SRC}/spinner.css`, inject: true, vendor: false},
      {src: `${this.CSS_SRC}/font-awesome.css`, inject: true, vendor: false}
    ];

    /* Add to or override NPM module configurations: */
    // this.mergeObject(this.PLUGIN_CONFIGS['browser-sync'], { ghostMode: false });
    this.mergeObject(this.SYSTEM_CONFIG_DEV['paths'], {
      'angular2-cookie': 'node_modules/angular2-cookie/bundles/angular2-cookie.js',
      'leaflet': 'node_modules/leaflet/dist/leaflet.js',
      'leaflet-polylinedecorator': 'node_modules/leaflet-polylinedecorator/leaflet.polylineDecorator.js',
      'd3': 'node_modules/d3/build/d3.min.js',
      'd3-tip': 'node_modules/d3-tip/index.js',
      'moment': 'node_modules/moment/moment.js',
      'moment-timezone': 'node_modules/moment-timezone/builds/moment-timezone-with-data-2010-2020.js'
    });
    this.mergeObject(this.SYSTEM_BUILDER_CONFIG['packages'], {
      'angular2-cookie': {
        main: './core.js',
        defaultExtension: 'js'
      },
      'd3': {
        main: 'build/d3.min.js',
        defaultExtension: 'js'
      },
      'moment-timezone': {
        main: 'builds/moment-timezone-with-data-2010-2020.min.js',
        defaultExtension: 'js'
      }
    });
  }

}
