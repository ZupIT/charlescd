FROM ruby:2.7.2-slim-buster
COPY server.rb /mock/
COPY Gemfile* /mock/
RUN apt-get update && apt-get install -y build-essential
WORKDIR /mock
RUN bundle install
CMD ruby server.rb -o 0.0.0.0
