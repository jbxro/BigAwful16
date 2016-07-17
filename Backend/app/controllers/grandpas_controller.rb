class GrandpasController < ApplicationController
  before_action :set_grandpa, only: [:show, :edit, :update, :destroy]

  # GET /grandpas
  # GET /grandpas.json
  def index
    @grandpas = Grandpa.all
  end

  # GET /grandpas/1
  # GET /grandpas/1.json
  def show
  end

  # GET /grandpas/new
  def new
    @grandpa = Grandpa.new
  end

  # GET /grandpas/1/edit
  def edit
  end

  # POST /grandpas
  # POST /grandpas.json
  def create
    @grandpa = Grandpa.new(grandpa_params)

    respond_to do |format|
      if @grandpa.save
        format.html { redirect_to @grandpa, notice: 'Grandpa was successfully created.' }
        format.json { render :show, status: :created, location: @grandpa }
      else
        format.html { render :new }
        format.json { render json: @grandpa.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /grandpas/1
  # PATCH/PUT /grandpas/1.json
  def update
    respond_to do |format|
      if @grandpa.update(grandpa_params)
        format.html { redirect_to @grandpa, notice: 'Grandpa was successfully updated.' }
        format.json { render :show, status: :ok, location: @grandpa }
      else
        format.html { render :edit }
        format.json { render json: @grandpa.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /grandpas/1
  # DELETE /grandpas/1.json
  def destroy
    @grandpa.destroy
    respond_to do |format|
      format.html { redirect_to grandpas_url, notice: 'Grandpa was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_grandpa
      @grandpa = Grandpa.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def grandpa_params
      params.fetch(:grandpa, {})
    end
end
