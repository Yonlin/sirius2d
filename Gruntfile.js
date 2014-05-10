module.exports = function(grunt) {
        grunt.initConfig({
            pkg: grunt.file.readJSON('package.json'),
            banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                '<%= pkg.url ? "* " + pkg.homepage + "\\n" : "" %>' +
                '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
                ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
            clean: {
                files: ['bin/*.js']
            },
            concat: {
                options: {
                    banner: '<%= banner %>',
                    stripBanners: true
                },
                all: {
                    src: [
                        "src/com/sirius2d/core/Sirius2D.js",
                        "src/com/sirius2d/core/Class.js",
                        "src/com/sirius2d/core/Interface.js",
                        
                        "src/com/sirius2d/mvc/ControlEvent.js",
                        "src/com/sirius2d/mvc/Controller.js",
                        "src/com/sirius2d/mvc/Model.js",
                        "src/com/sirius2d/mvc/View.js",
                        "src/com/sirius2d/mvc/Module.js",

                        "src/com/sirius2d/message/Broadcast.js",
                        "src/com/sirius2d/message/Message.js",
                        "src/com/sirius2d/message/MessageData.js",
                        "src/com/sirius2d/message/MessageList.js",
                        
                        "src/com/sirius2d/events/Event.js",
                        "src/com/sirius2d/events/EventDispatcher.js",
                        "src/com/sirius2d/events/MouseEvent.js",
                        "src/com/sirius2d/events/TimerEvent.js",
                        
                        "src/com/sirius2d/utils/ClassUtil.js",
                        "src/com/sirius2d/utils/ColorUtil.js",
                        "src/com/sirius2d/utils/HitTestUtil.js",
                        "src/com/sirius2d/utils/StringUtil.js",
                        "src/com/sirius2d/utils/Timer.js",
                        "src/com/sirius2d/utils/WebGLUtil.js",
                        
                        "src/com/sirius2d/system/Capabilities.js",
                        
                        "src/com/sirius2d/geom/ColorTransform.js",
                        "src/com/sirius2d/geom/FrameFunction.js",
                        "src/com/sirius2d/geom/Matrix2D.js",
                        "src/com/sirius2d/geom/Matrix3D.js",
                        "src/com/sirius2d/geom/Point.js",
                        "src/com/sirius2d/geom/QuadMatrixUtil.js",
                        "src/com/sirius2d/geom/Rectangle.js",
                        
                        "src/com/sirius2d/display/Stats.js",
                        "src/com/sirius2d/display/Blend.js",
                        "src/com/sirius2d/display/DisplayObject.js",
                        "src/com/sirius2d/display/FrameBuffer.js",
                        "src/com/sirius2d/geom/Group.js",
                        "src/com/sirius2d/display/Scene.js",
                        "src/com/sirius2d/display/Sprite.js",
                        "src/com/sirius2d/display/MovieClip.js",
                        "src/com/sirius2d/display/TextField.js",
                        "src/com/sirius2d/display/Quad.js",

                        "src/com/sirius2d/particle/ParticleCPU.js",
                        "src/com/sirius2d/particle/ParticleEmittersCPU.js",
                        "src/com/sirius2d/particle/ParticleStyle.js",
                        "src/com/sirius2d/display/Stage2D.js",
                        "src/com/sirius2d/display/Texture.js",
                        "src/com/sirius2d/display/TextureStyle.js",
                        
                        "src/com/sirius2d/shader/ShaderAbstract.js",
                        "src/com/sirius2d/shader/ShaderAdvanced.js",
                        "src/com/sirius2d/shader/ShaderBasis.js",
                        "src/com/sirius2d/shader/ShaderBlur.js",
                        "src/com/sirius2d/shader/ShaderFigure.js",
                        "src/com/sirius2d/shader/ShaderFlame.js",
                        "src/com/sirius2d/shader/ShaderFractal.js",
                        "src/com/sirius2d/shader/ShaderGlass.js",
                        "src/com/sirius2d/shader/ShaderGLSL.js",
                        "src/com/sirius2d/shader/ShaderGray.js",
                        "src/com/sirius2d/shader/ShaderHdr.js",
                        "src/com/sirius2d/shader/ShaderHeartbeat.js",
                        "src/com/sirius2d/shader/ShaderJoint.js",
                        "src/com/sirius2d/shader/ShaderLaser.js",
                        "src/com/sirius2d/shader/ShaderLight.js",
                        "src/com/sirius2d/shader/ShaderMosaic.js",
                        "src/com/sirius2d/shader/ShaderNet.js",
                        "src/com/sirius2d/shader/ShaderQuick.js",
                        "src/com/sirius2d/shader/ShaderRelief.js",
                        "src/com/sirius2d/shader/ShaderSpeed.js",
                        
                        "src/com/sirius2d/loader/AbstractLoader.js",
                        "src/com/sirius2d/loader/LoadQueue.js",
                        "src/com/sirius2d/loader/SamplePlugin.js",
                        "src/com/sirius2d/loader/TagLoader.js",
                        "src/com/sirius2d/loader/XHRLoader.js",
                        
                        "src/com/sirius2d/data/list/List.js",
                        "src/com/sirius2d/data/list/ListDecoder.js",
                        "src/com/sirius2d/data/list/ListEncoder.js",
                        "src/com/sirius2d/data/list/ListItem.js",
                        
                        "src/com/sirius2d/sound/SoundControl.js",
                        "src/com/sirius2d/sound/SoundItem.js",
                        "src/com/sirius2d/sound/SoundManager.js",
                        "src/com/sirius2d/component/Button.js"
                    ],
                    dest: 'bin/<%= pkg.name %>.<%= pkg.version %>.js'
                }
            },
            uglify: {
                options: {
                    banner: '<%= banner %>'
                },
                all: {
                    src: '<%= concat.all.dest %>',
                    dest: 'bin/<%= pkg.name %>.<%= pkg.version %>.min.js'
                }
            },
            replace: {
                dist: {
                    options: {
                        variables: {
                            'VERSION': '<%= pkg.version %>',
                            'DATE': '<%= grunt.template.today("yyyy-mm-dd") %>'
                        },
                        prefix: '@'
                    },
                    files: [
                        {
                            'src': ['bin/*.js'],
                            'dest': './'
                        }
                    ]
                }
            },

            jshint: {
                gruntfile: {
                    options: {
                        jshintrc: '.jshintrc'
                    },
                    src: 'Gruntfile.js'
                },
                src: {
                    options: {
                        jshintrc: 'src/.jshintrc'
                    },
                    src: ['src/**/*.js']
                }
            }
        });

        grunt.loadNpmTasks('grunt-replace');
        grunt.loadNpmTasks('grunt-contrib-clean');
        grunt.loadNpmTasks('grunt-contrib-concat');
        grunt.loadNpmTasks('grunt-contrib-uglify');
        grunt.loadNpmTasks('grunt-contrib-qunit');
        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.loadNpmTasks('grunt-contrib-watch');

        grunt.registerTask('default', ['clean', 'concat', 'replace', 'uglify']);

};