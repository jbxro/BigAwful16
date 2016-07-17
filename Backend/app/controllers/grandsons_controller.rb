class GrandsonsController < ApplicationController
  before_action :set_grandson, only: [:show, :edit, :update, :destroy]

  # GET /grandsons
  # GET /grandsons.json
  def index
    @grandsons = Grandson.all
  end

  # GET /grandsons/1
  # GET /grandsons/1.json
  def show
  end

  # GET /grandsons/new
  def new
    @grandson = Grandson.new
  end

  # GET /grandsons/1/edit
  def edit
  end

  # POST /grandsons
  # POST /grandsons.json
  def create
    @grandson = Grandson.new(grandson_params)

    respond_to do |format|
      if @grandson.save
        format.html { redirect_to @grandson, notice: 'Grandson was successfully created.' }
        format.json { render :show, status: :created, location: @grandson }
      else
        format.html { render :new }
        format.json { render json: @grandson.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /grandsons/1
  # PATCH/PUT /grandsons/1.json
  def update
    respond_to do |format|
      if @grandson.update(grandson_params)
        format.html { redirect_to @grandson, notice: 'Grandson was successfully updated.' }
        format.json { render :show, status: :ok, location: @grandson }
      else
        format.html { render :edit }
        format.json { render json: @grandson.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /grandsons/1
  # DELETE /grandsons/1.json
  def destroy
    @grandson.destroy
    respond_to do |format|
      format.html { redirect_to grandsons_url, notice: 'Grandson was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_grandson
      @grandson = Grandson.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def grandson_params
      params.fetch(:grandson, {})
    end
end
