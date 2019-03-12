<?php

namespace Deployer;

require 'recipe/symfony3.php';


// Project name
set('application', 'PocketCode Share');
set('repository', 'https://github.com/Catrobat/Catroweb-Symfony.git');
set('git_tty', false);


// Symfony build set
set('symfony_env', 'prod');

// Symfony shared dirs
set('shared_dirs',
  [
    'var/log',
    'var/sessions',
    'public/resources',
    'backups'
  ]);

// Shared files between deploys
add('shared_files',
  [
    'config/packages/parameters.yml',
    'config/packages/dev/parameters.yml', // only dev!
  ]);

// Symfony writable dirs
set('writable_dirs',
  [
    'var/cache',
    'var/log',
    'var/sessions',
    'backups',
  ]);



// Symfony executable and variable directories
set('bin_dir', 'bin');
set('var_dir', 'var');
set('web_dir', 'public');
set('public_dir', 'public');

set('allow_anonymous_stats', false);

// Hosts
host('unpriv@cat-share-exp.ist.tugraz.at')
  ->stage('exp')
  ->set('symfony_env', 'prod')
  ->set('branch', 'php7Iwillsaveyou')
  ->set('composer_options','install --verbose --prefer-dist --optimize-autoloader')
  ->set('deploy_path', '/var/www/share/');

// Tasks
/**
 * Main task
 */
task('deploy', [
  'deploy:info',
  'deploy:prepare',
  'deploy:lock',
  'deploy:release',
  'deploy:update_code',
  'deploy:clear_paths',
  'deploy:create_cache_dir',
  'deploy:shared',
  'deploy:assets',
  'deploy:vendors',
  //'deploy:assets:install',
  'deploy:assetic:dump',
  'deploy:cache:clear',
  'deploy:cache:warmup',
  'deploy:writable',
  'deploy:symlink',
  'deploy:unlock',
  'cleanup',
])->desc('Deploy Catroweb!');

// [Optional] if deploy fails automatically unlock.
after('deploy:failed', 'deploy:unlock');

// Migrate database before symlink new release.
// should maybe not be done automatically. we can do that no problem but that is not that nice.

//before('deploy:symlink', 'database:migrate');

// Manually define this task because deployer uses the old symfony structure with web instead of
// public. Change this when deployer gets updated.
task('install:assets', function () {
  run('{{bin/php}} {{bin/console}} assets:install --symlink --relative public');
});

// For such sudo commands to work, the server must allow those commands without a password
// change the sudoers file if needed!
task('restart:nginx', function () {
  run('sudo /usr/sbin/service nginx restart');
});
task('restart:php-fpm', function () {
  run('sudo /usr/sbin/service php7.2-fpm restart');
});
task('install:npm', function () {
  cd('{{release_path}}');
  run('npm install');
});
task('deploy:grunt', function () {
  cd('{{release_path}}');
  run('grunt');
});
after('deploy:unlock', 'install:assets');
after('install:assets', 'install:npm');
after('install:npm', 'deploy:grunt');
after('deploy:grunt', 'restart:nginx');
after('restart:nginx', 'restart:php-fpm');

