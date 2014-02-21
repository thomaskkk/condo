<?php

namespace TK\Condo\MoradoresBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use TK\Condo\MoradoresBundle\Entity\Morador;
use TK\Condo\MoradoresBundle\Form\MoradorType;

/**
 * Morador controller.
 *
 * @Route("/morador")
 */
class MoradorController extends Controller
{

    /**
     * Lists all Morador entities.
     *
     * @Route("/", name="morador")
     * @Method("GET")
     * @Template()
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $entities = $em->getRepository('TKCondoMoradoresBundle:Morador')->findAll();

        return array(
            'entities' => $entities,
        );
    }
    /**
     * Creates a new Morador entity.
     *
     * @Route("/", name="morador_create")
     * @Method("POST")
     * @Template("TKCondoMoradoresBundle:Morador:new.html.twig")
     */
    public function createAction(Request $request)
    {
        $entity = new Morador();
        $form = $this->createCreateForm($entity);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('morador_show', array('id' => $entity->getId())));
        }

        return array(
            'entity' => $entity,
            'form'   => $form->createView(),
        );
    }

    /**
    * Creates a form to create a Morador entity.
    *
    * @param Morador $entity The entity
    *
    * @return \Symfony\Component\Form\Form The form
    */
    private function createCreateForm(Morador $entity)
    {
        $form = $this->createForm(new MoradorType(), $entity, array(
            'action' => $this->generateUrl('morador_create'),
            'method' => 'POST',
        ));

        $form->add('submit', 'submit', array('label' => 'Create'));

        return $form;
    }

    /**
     * Displays a form to create a new Morador entity.
     *
     * @Route("/new", name="morador_new")
     * @Method("GET")
     * @Template()
     */
    public function newAction()
    {
        $entity = new Morador();
        $form   = $this->createCreateForm($entity);

        return array(
            'entity' => $entity,
            'form'   => $form->createView(),
        );
    }

    /**
     * Finds and displays a Morador entity.
     *
     * @Route("/{id}", name="morador_show")
     * @Method("GET")
     * @Template()
     */
    public function showAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('TKCondoMoradoresBundle:Morador')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Morador entity.');
        }

        $deleteForm = $this->createDeleteForm($id);

        return array(
            'entity'      => $entity,
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Displays a form to edit an existing Morador entity.
     *
     * @Route("/{id}/edit", name="morador_edit")
     * @Method("GET")
     * @Template()
     */
    public function editAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('TKCondoMoradoresBundle:Morador')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Morador entity.');
        }

        $editForm = $this->createEditForm($entity);
        $deleteForm = $this->createDeleteForm($id);

        return array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
    * Creates a form to edit a Morador entity.
    *
    * @param Morador $entity The entity
    *
    * @return \Symfony\Component\Form\Form The form
    */
    private function createEditForm(Morador $entity)
    {
        $form = $this->createForm(new MoradorType(), $entity, array(
            'action' => $this->generateUrl('morador_update', array('id' => $entity->getId())),
            'method' => 'PUT',
        ));

        $form->add('submit', 'submit', array('label' => 'Update'));

        return $form;
    }
    /**
     * Edits an existing Morador entity.
     *
     * @Route("/{id}", name="morador_update")
     * @Method("PUT")
     * @Template("TKCondoMoradoresBundle:Morador:edit.html.twig")
     */
    public function updateAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('TKCondoMoradoresBundle:Morador')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Morador entity.');
        }

        $deleteForm = $this->createDeleteForm($id);
        $editForm = $this->createEditForm($entity);
        $editForm->handleRequest($request);

        if ($editForm->isValid()) {
            $em->flush();

            return $this->redirect($this->generateUrl('morador_edit', array('id' => $id)));
        }

        return array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }
    /**
     * Deletes a Morador entity.
     *
     * @Route("/{id}", name="morador_delete")
     * @Method("DELETE")
     */
    public function deleteAction(Request $request, $id)
    {
        $form = $this->createDeleteForm($id);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $entity = $em->getRepository('TKCondoMoradoresBundle:Morador')->find($id);

            if (!$entity) {
                throw $this->createNotFoundException('Unable to find Morador entity.');
            }

            $em->remove($entity);
            $em->flush();
        }

        return $this->redirect($this->generateUrl('morador'));
    }

    /**
     * Creates a form to delete a Morador entity by id.
     *
     * @param mixed $id The entity id
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm($id)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('morador_delete', array('id' => $id)))
            ->setMethod('DELETE')
            ->add('submit', 'submit', array('label' => 'Delete'))
            ->getForm()
        ;
    }
}
