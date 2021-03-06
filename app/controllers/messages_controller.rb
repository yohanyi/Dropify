class MessagesController < ApplicationController
  def index
    all_messages = Message.all
    messages_array = []

    all_messages.each do |mess|

      mess_hash = {
        id: mess.id,
        title: mess.title,
        url: mess.url,
        content: mess.content,
        latitude: mess.latitude,
        longitude: mess.longitude,
        user: mess.user
      }

      if mess.pictures[0]
        mess_hash[:picture] = mess.pictures[0]
      end

      if mess.comments.flatten != nil
        mess_hash[:comments] = mess.comments.map {|comment| {comment: comment, username: comment.user.username, comment_vote_count: comment.votes.sum(:value)} }
      end

      if mess.votes.flatten != nil
        mess_hash[:vote_count] = mess.votes.sum(:value)
      end

      messages_array << mess_hash
    end
    render json: messages_array
  end

  def create
    new_message = current_user.messages.new(title: params[:message][:title], url: params[:message][:url], content: params[:message][:content], latitude: params[:message][:latitude], longitude: params[:message][:longitude])

    if params[:message][:advert]

      new_message = current_user.messages.new(title: params[:message][:title], url: params[:message][:url], content: params[:message][:content], latitude: params[:message][:latitude], longitude: params[:message][:longitude], advert: params[:message][:advert])
      new_message.save
      session[:message_id] = new_message.id
      render json: new_message
    else
      new_message = current_user.messages.new(title: params[:message][:title], url: params[:message][:url], content: params[:message][:content], latitude: params[:message][:latitude], longitude: params[:message][:longitude])

        new_message.save
        session[:message_id] = new_message.id
        render json: new_message
    end
  end

  def show
    message = Message.find(params[:id])
    if message
      render json: message
    else
      render json: {errors: message.errors}
    end
  end

  def update
    message = Message.find(params[:id])
    #assuming params
    if message.update_attributes(params[:message])
      render json: message
    else
      #can render different messages
      render json: {errors: message.errors}
    end
  end

  def destroy
    message = Message.find(params[:id])
    if message
      message.destroy
    else
      render json: {errors: "Message does not exist"}
    end
  end
end