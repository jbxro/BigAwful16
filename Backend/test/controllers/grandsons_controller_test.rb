require 'test_helper'

class GrandsonsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @grandson = grandsons(:one)
  end

  test "should get index" do
    get grandsons_url
    assert_response :success
  end

  test "should get new" do
    get new_grandson_url
    assert_response :success
  end

  test "should create grandson" do
    assert_difference('Grandson.count') do
      post grandsons_url, params: { grandson: {  } }
    end

    assert_redirected_to grandson_url(Grandson.last)
  end

  test "should show grandson" do
    get grandson_url(@grandson)
    assert_response :success
  end

  test "should get edit" do
    get edit_grandson_url(@grandson)
    assert_response :success
  end

  test "should update grandson" do
    patch grandson_url(@grandson), params: { grandson: {  } }
    assert_redirected_to grandson_url(@grandson)
  end

  test "should destroy grandson" do
    assert_difference('Grandson.count', -1) do
      delete grandson_url(@grandson)
    end

    assert_redirected_to grandsons_url
  end
end
