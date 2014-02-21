# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|

  config.vm.box = "precise32"

  config.vm.box_url = "http://files.vagrantup.com/precise32.box"

  config.vm.network "private_network", ip: "192.168.50.4"

  config.vm.synced_folder "www/app/cache", "/vagrant/www/app/cache", owner: "www-data", group: "www-data",  :mount_options => ["dmode=777","fmode=777"]
  config.vm.synced_folder "www/app/logs", "/vagrant/www/app/logs", owner: "www-data", group: "www-data",  :mount_options => ["dmode=777","fmode=777"]

  config.vm.provision :shell, :path => "bootstrap.sh"

end
