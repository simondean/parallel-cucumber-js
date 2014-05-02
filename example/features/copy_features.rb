#!/usr/bin/env ruby

require 'fileutils'

(1..99).each do |index|
  copy_dir = File.join(File.dirname(File.expand_path(__FILE__)), "waiting/copy_#{index}")
  FileUtils.rm_rf copy_dir if Dir.exists? copy_dir
  FileUtils.cp_r 'waiting/original', copy_dir
end