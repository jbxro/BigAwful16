require 'test_helper'

class GrandpasControllerTest < ActionDispatch::IntegrationTest
  setup do
    @grandpa = grandpas(:one)
  end

  test "should get index" do
    get grandpas_url
    assert_response :success
  end

  test "should get new" do
    get new_grandpa_url
    assert_response :success
  end

  test "should create grandpa" do
    assert_difference('Grandpa.count') do
      post grandpas_url, params: { grandpa: {  } }
    end

    assert_redirected_to grandpa_url(Grandpa.last)
  end

  test "should show grandpa" do
    get grandpa_url(@grandpa)
    assert_response :success
  end

  test "should get edit" do
    get edit_grandpa_url(@grandpa)
    assert_response :success
  end

  test "should update grandpa" do
    patch grandpa_url(@grandpa), params: { grandpa: {  } }
    assert_redirected_to grandpa_url(@grandpa)
  end

  test "should destroy grandpa" do
    assert_difference('Grandpa.count', -1) do
      delete grandpa_url(@grandpa)
    end

    assert_redirected_to grandpas_url
  end
end
