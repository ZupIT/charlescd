# frozen_string_literal: true

require 'sinatra'
require 'sinatra/json'

set :environment, :production

configure { set :server, :puma }

get '/:chart_name/contents/*/:tgz_file_name' do
  content_type :json
  requested_chart = params[:chart_name]
  requested_tgz = params[:tgz_file_name]
  tgz_path = "./charts/#{requested_chart}/#{requested_tgz}"

  halt(404, "#{File.expand_path(tgz_path)} does not exists") if !File.exists?(tgz_path)

  data = File.open(tgz_path).read
  encoded = Base64.encode64(data)
  json(
    name: requested_chart,
    path: "#{requested_chart}/#{requested_tgz}",
    sha: "f529ce0b7606246f1f4842738cee1262ec1aa350",
    size: 42457,
    url: "https://api.github.com/repos/ZupIT/darwin-k8s-chart-values/contents/darwin-content/darwin-content-darwin.tgz?ref=master",
    html_url: "https://github.com/ZupIT/darwin-k8s-chart-values/blob/master/darwin-content/darwin-content-darwin.tgz",
    git_url: "https://api.github.com/repos/ZupIT/darwin-k8s-chart-values/git/blobs/f529ce0b7606246f1f4842738cee1262ec1aa350",
    download_url: "https://raw.githubusercontent.com/ZupIT/darwin-k8s-chart-values/master/darwin-content/darwin-content-darwin.tgz?token=AAFUUM44UASGCUE6526CGVC66ZDB4",
    type: "file",
    content: encoded,
    encoding: "base64",
    _links: {
        self: "https://api.github.com/repos/ZupIT/darwin-k8s-chart-values/contents/darwin-content/darwin-content-darwin.tgz?ref=master",
        git: "https://api.github.com/repos/ZupIT/darwin-k8s-chart-values/git/blobs/f529ce0b7606246f1f4842738cee1262ec1aa350",
        html: "https://github.com/ZupIT/darwin-k8s-chart-values/blob/master/darwin-content/darwin-content-darwin.tgz"
    }
    )
end
