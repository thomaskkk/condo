<?php

namespace TK\Condo\MoradoresBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class MoradorType extends AbstractType
{
        /**
     * @param FormBuilderInterface $builder
     * @param array $options
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('nome', 'text', array(
                'max_length' => '255',
                'attr' => array(
                    'placeholder' => 'Nome Completo'
                ),
            ))
            ->add('cpf', 'text', array(
                'max_length' => '11',
                'required' => false,
                'empty_data'  => null,
                'attr' => array(
                    'placeholder' => 'CPF'
                ),
            ))
            ->add('rg', 'text', array(
                'max_length'=> '11',
                'required' => false,
                'empty_data'  => null,
                'attr' => array('placeholder' => 'RG'),
            ))
            ->add('dataNascimento', 'date', array(
                'widget' => 'single_text',
                'format' => 'dd-MM-yyyy',
                'attr' => array(
                    'placeholder' => 'Data de Nascimento',
                    'class' => 'datepicker',
                    'data-dateformat' => 'dd-mm-yy',

                ),
            ))
            ->add('sexo', 'choice', array(
                'required' => false,
                'choices' => array(
                    '' => 'Selecione o genero',
                    'm' => 'Masculino',
                    'f' => 'Feminino'
                ),
            ))
            ->add('telefoneCelular', 'text', array(
                'max_length'=> '10',
                'attr' => array(
                    'placeholder' => 'Telefone Celular'
                ),
            ))
            ->add('foto', 'file')
            ->add('submit', 'submit', array(
                'label' => 'Adicionar',
                'attr' => array(
                    'style' => 'btn btn-primary'
                ),
            ))
        ;


    }
    
    /**
     * @param OptionsResolverInterface $resolver
     */
    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'TK\Condo\MoradoresBundle\Entity\Morador'
        ));
    }

    /**
     * @return string
     */
    public function getName()
    {
        return 'tk_condo_moradoresbundle_morador';
    }
}
